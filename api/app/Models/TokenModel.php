<?php

namespace App\Models;

use CodeIgniter\Model;

class TokenModel extends Model
{
    protected $table = 'tokens';

    protected $allowedFields = ['type', 'secret_key', 'content'];
}
