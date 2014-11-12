<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInviteeTable extends Migration {
    
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::create('invitees',function($table){
                
                $table->engine = 'InnoDB';
                
                $table->increments('id');
                $table->string('token');
                $table->integer('event_id')->unsigned();
                $table->string('name')->default('Anonymous');
                $table->string('email');
                $table->enum('participation',array('pending','confirmed','declined','maybe'));
                $table->timestamps();
            
                $table->foreign('event_id')->references('id')->on('events');    
            });
            
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
	    Schema::drop('invitees');
	}

}
