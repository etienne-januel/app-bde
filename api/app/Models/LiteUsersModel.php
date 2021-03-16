<?php

namespace App\Models;

use CodeIgniter\Model;

class LiteUsersModel extends Model
{
    protected $table = 'lite_users';

    protected $allowedFields = ['mail', 'registration_step', 'token_id'];
}
