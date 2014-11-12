<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::create('users',function($table){

                $table->engine = 'InnoDB';

                $table->increments('id');
                $table->string('username');
                $table->string('password');
                $table->string('email');
                $table->string('remember_token',100);
                $table->timestamps();
            });
            
            $user = new User();
            $user->username = 'filou';
            $user->email = 'me@filou.se';
            $user->password = Hash::make('asdf');
            $user->save();
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('users');
	}

}
