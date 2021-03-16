<?php

namespace App\Controllers;

use App\Models\TokenModel;
use App\Models\UsersModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
	public function returnJsonResponse($httpCode, $status, $data = null)
	{
		if ($data) {
			return json_encode(array_merge(array("http_code" => $httpCode, "status" => $status), $data));
		}
		return json_encode(array("http_code" => $httpCode, "status" => $status));
	}

	public function login()
	{
		header("Access-Control-Allow-Origin: *");
		header("Content-Type: application/json");
		$this->request->setGlobal("request", $this->request->getJSON(true));
		$userModel = new UsersModel();

		if ($result = $userModel->where("username", $this->request->getJSON()->username)->first()) {
			if (password_verify($this->request->getJSON()->password, $result["password"])) {
				$jwt = $this->createJwt($result);
				return $this->returnJsonResponse(200, "authorized", ["jwt" => $jwt]);
			}
		}
		return $this->returnJsonResponse(401, "forbiden");
	}

	public function register($step)
	{
		header("Access-Control-Allow-Origin: *");
		header("Content-Type: application/json");
		$this->request->setGlobal("request", $this->request->getJSON(true));

		if ($this->validate([
			"userInfo" => "required"
		])) {
			$userInfo = $this->request->getVar("userInfo");
		} else {
			return $this->returnJsonResponse(401, "forbiden");
		}

		switch ($step) {
			case 1:
				if ($this->validate([
					"userInfo.mail" => "required|is_unique[users.mail]|min_length[3]|max_length[255]"
				])) {
					$force = $this->request->getVar("force");
					if ($this->verifyMail($userInfo["mail"])) {
						$tokenInsert = $this->insertToken($userInfo, 0, $force);
						if ($tokenInsert) {
							if ($this->sendMail(["mail" => $userInfo["mail"], "token" => $tokenInsert], 0)) {
								return $this->returnJsonResponse(200, "created", ["message" => "Token was successfully created and mail was sent to the user."]);
							}
							return $this->returnJsonResponse(400, "error", ["message" => "Email could not be sent, please try again later."]);
						}
						return $this->returnJsonResponse(200, "exist", ["message" => "We already registered your mail, please check your mailbox"]);
					}
					return $this->returnJsonResponse(401, "error", ["message" => "User mail must be hosted by laplateforme.io"]);
				}
				return $this->returnJsonResponse(401, "error", ["message" => $this->validator->getErrors()]);
				break;
			case 2:
				if ($this->validate([
					"userInfo.verificationCode" => "required|exact_length[6]",
				])) {
					if ($this->authenticateToken($userInfo, 0) != null) {
						return $this->returnJsonResponse(200, "authorized", ["message" => "Token successfully verified"]);
					}
					return $this->returnJsonResponse(401, "forbiden", ["message" => "Token is wrong"]);
				}
				return $this->returnJsonResponse(401, "error", ["message" => $this->validator->getErrors()]);
				break;
			case 3:
				if ($this->validate([
					"userInfo.mail" => "required|is_unique[users.mail]|min_length[3]|max_length[255]",
					"userInfo.password" => "required|min_length[8]|max_length[255]",
					"userInfo.username" => "required",
					"userInfo.verificationCode" => "required"
				])) {
					$tokenCheck = $token = $this->authenticateToken($userInfo, 0);
					if ($tokenCheck != null) {
						$tokenContent = json_decode($token["content"]);
						if ($tokenContent->mail == $userInfo["mail"]) {
							if ($this->updateTokenContent($token["id"], $token["type"], $userInfo("password"))) {
								return $this->returnJsonResponse(200, "authorized", ["message" => "Token successfully updated"]);
							}
							return $this->returnJsonResponse(401, "error", ["message" => "Token could not be updated"]);
						}
						return $this->returnJsonResponse(401, "forbiden", ["message" => "Posted mail doesn't corresponds to token mail"]);
					}
					return $this->returnJsonResponse(401, "forbiden", ["message" => "Token is wrong"]);
				}
				return $this->returnJsonResponse(401, "error", ["message" => $this->validator->getErrors()]);
				break;
		}
	}

	public function updateTokenContent($tokenId, $tokenType, $data)
	{
		$tokenModel = new TokenModel();

		$mockTokenContent = json_decode($tokenModel->where("id", $tokenId)->first()["content"]);

		switch ($tokenType) {
			case 0:
				$mockTokenContent->password = $data;
				$result = $tokenModel->update($tokenId, ["type" => 1, "content" => json_encode($mockTokenContent)]);
				break;
			default:
				$result = false;
		}
		return $result;
	}

	public function getTokenIfExist($data, $tokenType)
	{
		$tokenModel = new TokenModel();

		switch ($tokenType) {
			case 0:
				$result = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $data["mail"])->first();
				break;
		}
		return $result;
	}

	public function insertToken($data, $tokenType, $force)
	{
		$tokenModel = new TokenModel();

		switch ($tokenType) {
			case 0:
				$token = $this->getTokenIfExist($data, $tokenType);
				if (!$token || $force) {
					if ($force) {
						$tokenModel->delete($token["id"], true);
					}
					$secret_key = random_int(100000, 999999);
					$tokenModel->save([
						"type" => 0,
						"secret_key" => $secret_key,
						"content" => json_encode(["mail" => $data["mail"]]),
					]);
					$return = $secret_key;
				} else {
					$return = false;
				}
				break;
		}
		return $return;
	}

	public function updateToken($data, $tokenId)
	{
		$tokenModel = new TokenModel();

		$tokenModel->update($tokenId, $data);
	}

	public function authenticateToken($data, $tokenType)
	{
		$tokenModel = new TokenModel();

		switch ($tokenType) {
			case 0:
				$result = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $data["mail"])->first();
				$data["verificationCode"] == $result["secret_key"] ? $return = $result : $return = false;
				break;
		}
		return $return;
	}

	private function verifyMail($mail)
	{
		return explode("@", $mail)[1] == "laplateforme.io";
	}

	private function sendMail($data, $mailType)
	{
		switch ($mailType) {
			case 0:
				$email = \Config\Services::email();

				$email->setTo($data["mail"]);
				$email->setFrom("mailer@laplateforme.io", "BDE Mailer");

				$email->setSubject("LaPlateforme_ Student Registration");
				$email->setMessage("Voici votre code de vérification à 2 étapes : " . $data["token"]);
				break;
		}
		$email->send() ? $return = true : $return = false;

		return $return;
	}

	public function decodeJwt($jwt)
	{
		$explodedJwt = \explode(".", $jwt);

		list($headerb64, $payloadb64, $signatureb64) = $explodedJwt;

		return [
			"header" => json_decode(str_replace(["-", "_", ""], ["+", "/", "="], base64_decode($headerb64))),
			"payload" => json_decode(str_replace(["-", "_", ""], ["+", "/", "="], base64_decode($payloadb64))),
			"signature" => json_decode(str_replace(["-", "_", ""], ["+", "/", "="], base64_decode($signatureb64)))
		];
	}

	public function createJwt($data)
	{

		$header = json_encode(["typ" => "JWT", "alg" => "HS256"]);
		$payload = json_encode(
			[
				"iss" => "localhost:3000",
				"aud" => "localhost:8080",
				"iat" => idate("U"),
				"data" => $data
			]
		);
		$base64UrlHeader = str_replace(["+", "/", "="], ["-", "_", ""], base64_encode($header));
		$base64UrlPayload = str_replace(["+", "/", "="], ["-", "_", ""], base64_encode($payload));
		$privateKey = "mff?dr+f^pBZS6ze";
		$signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64UrlPayload, $privateKey, true);
		$base64UrlSignature = str_replace(["+", "/", "="], ["-", "_", ""], base64_encode($signature));
		$jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

		return $jwt;
	}
}


