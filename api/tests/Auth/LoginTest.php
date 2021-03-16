<?php

use PHPUnit\Framework\TestCase;
use App\Controllers\Auth;

class LoginTest extends TestCase
{
  public function testStub(): void
  {
    $stub = $this->createStub(Auth::class);
    $stub->method('lunit')->willReturn('casse ta daronne');
    $this->assertSame('casse ta daronne', $stub->lunit());
  }
}
