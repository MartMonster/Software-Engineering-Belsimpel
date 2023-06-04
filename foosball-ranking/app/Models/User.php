<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Model implements AuthenticatableContract,
    AuthorizableContract,
    CanResetPasswordContract, MustVerifyEmail
{
    use Authenticatable, Authorizable, CanResetPassword, HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'lastname'
    ];

    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    /**
    * @codeCoverageIgnore
    */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    /**
    * @codeCoverageIgnore
    */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @codeCoverageIgnore
     */
    public function hasVerifiedEmail()
    {
        // TODO: Implement hasVerifiedEmail() method.
        return $this->email_verified_at != null;
    }

    /**
     * @codeCoverageIgnore
     */
    public function markEmailAsVerified()
    {
        // TODO: Implement markEmailAsVerified() method.
        $this->email_verified_at = now();
    }
    /**
    * @codeCoverageIgnore
    */

    public function sendEmailVerificationNotification()
    {
        // TODO: Implement sendEmailVerificationNotification() method.
    }
    /**
    * @codeCoverageIgnore
    */
    public function getEmailForVerification()
    {
        // TODO: Implement getEmailForVerification() method.
    }

    /**
    * @codeCoverageIgnore
    */
    public static function getIdFromUsername($username)
    {
        $user = User::where('username', $username)->first();
        if (is_null($user)) {
            return null;
        }
        return $user->id;
    }
}
