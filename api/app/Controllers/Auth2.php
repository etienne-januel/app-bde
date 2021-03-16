<?php

namespace App\Controllers;

use App\Models\TokenModel;
use App\Models\UsersModel;
use App\Models\LiteUsersModel;
use CodeIgniter\Controller;
use CodeIgniter\I18n\Time;

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
					"userInfo.mail" => "required|min_length[3]|max_length[255]"
				])) {
					if ($this->isMailValid($userInfo["mail"])) {
						// return $this->returnJsonResponse(600, "success", ["message" => $this->createLiteUser($userInfo)]);
						$liteUserInsertStatus = $this->createLiteUser($userInfo);
						if (is_bool($liteUserInsertStatus)) {
							if ($liteUserInsertStatus) {
								return $this->returnJsonResponse(200, "success");
							}
							return $this->returnJsonResponse(401, "error", ["message" => "The LiteUser could not be created"]);
						}
						return $this->returnJsonResponse(200, "exist", ["step" => $liteUserInsertStatus]);
					}
					return $this->returnJsonResponse(401, "error", ["message" => "User mail must be hosted by laplateforme.io"]);
				}
				return $this->returnJsonResponse(401, "error", ["message" => $this->validator->getErrors()]);
				break;
			case 2:
				if ($this->validate([
					"userInfo.verificationCode" => "required|exact_length[6]",
				])) {
					if ($this->authenticateToken($userInfo["verificationCode"], $userInfo["mail"])) {
						return $this->returnJsonResponse(200, "authorized", ["message" => "Token successfully verified"]);
					}
					return $this->returnJsonResponse(401, "forbiden", ["message" => "Token is wrong"]);
				}
				return $this->returnJsonResponse(401, "error", ["message" => $this->validator->getErrors()]);
				break;
		}
	}


	private function createLiteUser($data)
	{
		$isMailAvailable = $this->isMailAvailable($data["mail"]);
		if (is_bool($isMailAvailable)) {
			if ($isMailAvailable) {
				$tokenId = $this->insertToken($data["mail"]);
				$liteUsersModel = new LiteUsersModel();
				if ($liteUsersModel->insert([
					"mail" => $data["mail"],
					"registration_step" => 0,
					"token_id" => $tokenId
				])) {
					return true;
				}
			}
			return false;
		}
		return $isMailAvailable;
	}

	private function isMailAvailable($mail)
	{

		$liteUsersModel = new LiteUsersModel();
		$usersModel = new UsersModel();
		$tokenModel = new TokenModel();

		if ($usersModel->where("mail", $mail)->first() !== null) {
			return false;
		}

		$token = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $mail)->first();
		$liteUser = $liteUsersModel->where("mail", $mail)->first();
		if (($token) && ($liteUser)) {
			if ($liteUser["mail"] == json_decode($token["content"])->mail) {
				return $liteUser["registration_step"];
			}
		} else {
			return true;
		}
	}

	public function insertToken($mail)
	{
		$tokenModel = new TokenModel();

		$secret_key = random_int(100000, 999999);
		$expire_date = new Time("now");

		return $tokenModel->insert([
			"secret_key" => $secret_key,
			"content" => json_encode(["mail" => $mail]),
			"expire_at" => $expire_date
		]);
	}

	private function authenticateToken($secret_key, $mail)
	{
		$tokenModel = new TokenModel();

		$token = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $mail)->first();
		if ($secret_key == $token["secret_key"]) {
			return $token;
		}
		return false;
	}


	// public function updateTokenContent($tokenId, $tokenType, $data)
	// {
	// 	$tokenModel = new TokenModel();

	// 	$mockTokenContent = json_decode($tokenModel->where("id", $tokenId)->first()["content"]);

	// 	switch ($tokenType) {
	// 		case 0:
	// 			$mockTokenContent->password = $data;
	// 			$result = $tokenModel->update($tokenId, ["type" => 1, "content" => json_encode($mockTokenContent)]);
	// 			break;
	// 		default:
	// 			$result = false;
	// 	}
	// 	return $result;
	// }

	// public function getTokenIfExist($data, $tokenType)
	// {
	// 	$tokenModel = new TokenModel();

	// 	switch ($tokenType) {
	// 		case 0:
	// 			$result = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $data["mail"])->first();
	// 			break;
	// 	}
	// 	return $result;
	// }

	// public function updateToken($data, $tokenId)
	// {
	// 	$tokenModel = new TokenModel();

	// 	$tokenModel->update($tokenId, $data);
	// }

	// public function authenticateToken($data, $tokenType)
	// {
	// 	$tokenModel = new TokenModel();

	// 	switch ($tokenType) {
	// 		case 0:
	// 			$result = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $data["mail"])->first();
	// 			$data["verificationCode"] == $result["secret_key"] ? $return = $result : $return = false;
	// 			break;
	// 	}
	// 	return $return;
	// }

	private function isMailValid($mail)
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
