<?php

namespace App\Controllers;

use App\Models\TokenModel;
use App\Models\UsersModel;
use CodeIgniter\Controller;

class Auth extends Controller
{
	public function login()
	{
		header("Access-Control-Allow-Origin: *");
		header('Content-Type: application/json');
		$this->request->setGlobal('request', $this->request->getJSON(true));
		$userModel = new UsersModel();

		if ($result = $userModel->where('username', $this->request->getJSON()->username)->first()) {
			if (password_verify($this->request->getJSON()->password, $result['password'])) {
				$jwt = $this->createJwt($result);
				return json_encode(array("http_code" => 200, "message" => "User successfully logged", "jwt" => $jwt));
			}
		}
		return json_encode(array("http_code" => 401, "message" => "Invalid credentials"));
	}

	public function register($step)
	{
		header("Access-Control-Allow-Origin: *");
		header('Content-Type: application/json');
		$this->request->setGlobal('request', $this->request->getJSON(true));

		switch ($step) {
			case 1:
				if ($this->validate([
					'mail' => 'required|is_unique[users.mail]|min_length[3]|max_length[255]'
				])) {
					$supposedLaPlateforme = explode('@', $this->request->getVar('mail'));
					if ($supposedLaPlateforme[1] == 'laplateforme.io') {
						$tokenInsert = $this->insertToken($this->request->getVar(), 0);
						if ($tokenInsert) {
							$mailSend = $this->sendMail(["mail" => $this->request->getVar('mail'), "token" => $tokenInsert], 0);
							if ($mailSend) {
								return json_encode(array("http_code" => 200, "message" => "Token was successfully created and mail was sent to the user."));
							}
							return json_encode(array("http_code" => 400, "message" => "Email could not be sent, please try again later"));
						}
						return json_encode(array("http_code" => 200, "message" => "We already registered your mail, please check your mailbox"));
					}
					return json_encode(array("http_code" => 401, "message" => "User mail must be hosted by laplateforme.io"));
				}
				return json_encode(array("http_code" => 401, "message" => $this->validator->getErrors()));
				break;
			case 2:
				if ($this->validate([
					'verificationCode' => 'required|exact_length[6]',
				])) {
					$tokenCheck = $this->authenticateToken($this->request->getVar(), 0);
					if ($tokenCheck != null) {
						return json_encode(array("http_code" => 200, "message" => 'Token successfully verified'));
					}
					return json_encode(array("http_code" => 401, "message" => 'Token is wrong'));
				}
				return json_encode(array("http_code" => 401, "message" => $this->validator->getErrors()));
				break;
			case 3:
				if ($this->validate([
					'mail' => 'required|is_unique[users.mail]|min_length[3]|max_length[255]',
					'password' => 'required|min_length[8]|max_length[255]'
				])) {
					return json_encode(array("http_code" => 200, "message" => 'Step 3 yes'));
				}
				return json_encode(array("http_code" => 200, "message" => 'Step 3 no'));
				break;
		}
	}

	public function checkTokenExistance($data, $tokenType)
	{
		$tokenModel = new TokenModel();

		switch ($tokenType) {
			case 0:
				$result = $tokenModel->where("JSON_EXTRACT(content, '$.mail')", $data["mail"])->first();
				$result ? $return = true : $return = false;
				break;
		}
		return $return;
	}

	public function insertToken($data, $tokenType)
	{
		$tokenModel = new TokenModel();

		switch ($tokenType) {
			case 0:
				if (!$this->checkTokenExistance($data, $tokenType)) {
					$secret_key = random_int(100000, 999999);
					$tokenModel->save([
						'type' => 0,
						'secret_key' => $secret_key,
						'content' => json_encode(["mail" => $data["mail"]]),
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
				$data["verificationCode"] == $result["secret_key"] ? $return = $result["content"] : $return = false;
				break;
		}
		return $return;
	}

	private function sendMail($data, $mailType)
	{
		switch ($mailType) {
			case 0:
				$email = \Config\Services::email();

				$email->setTo($data["mail"]);
				$email->setFrom('mailer@laplateforme.io', 'BDE Mailer');

				$email->setSubject('LaPlateforme_ Student Registration');
				$email->setMessage('Voici votre code de vérification à 2 étapes : ' . $data["token"]);
				break;
		}
		$email->send() ? $return = true : $return = false;

		return $return;
	}

	public function decodeJwt($jwt)
	{
		$explodedJwt = \explode('.', $jwt);

		list($headerb64, $payloadb64, $signatureb64) = $explodedJwt;

		return [
			"header" => json_decode(str_replace(['-', '_', ''], ['+', '/', '='], base64_decode($headerb64))),
			"payload" => json_decode(str_replace(['-', '_', ''], ['+', '/', '='], base64_decode($payloadb64))),
			"signature" => json_decode(str_replace(['-', '_', ''], ['+', '/', '='], base64_decode($signatureb64)))
		];
	}

	public function createJwt($data)
	{

		$header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
		$payload = json_encode(
			[
				"iss" => "localhost:3000",
				"aud" => "localhost:8080",
				"iat" => idate("U"),
				"data" => $data
			]
		);
		$base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
		$base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
		$privateKey = 'mff?dr+f^pBZS6ze';
		$signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $privateKey, true);
		$base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
		$jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

		return $jwt;
	}
}
