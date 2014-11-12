<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::create('events',function($table){
                
                $table->engine = 'InnoDB';
                
                $table->increments('id');
                $table->string('name');
                $table->text('description');
                $table->string('location');
                $table->datetime('startDate');
//                $table->datetime('endDate');
//                $table->boolean('active')->default(FALSE);
                $table->enum('state',array('draft','live'))->default('draft');
                $table->enum('visibility',array('public','protected','private'))->default('private');
//                $table->boolean('publicCanRegister');
//                $table->boolean('participantsVisible');
//                $table->integer('participantLimit')->unsigned()->default(0);
                $table->timestamps();
            });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
	    Schema::drop('events');
	}

}
