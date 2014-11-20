<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTodoTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::create('todos',function($table){
                
                $table->engine = 'InnoDB';
                
                $table->increments('id');
                $table->string('name');
                $table->enum('priority',array('critical','high','normal','low'))->default('normal');
                $table->datetime('deadline');
                $table->text('description');
                $table->enum('state',array('pending','closed'))->default('pending');
                $table->datetime('closedDate')->nullable()->default(NULL);
                $table->integer('closedByUserId')->unsigned()->nullable()->default(NULL);
                $table->timestamps();
                
                $table->foreign('closedByUserId')->references('id')->on('users')->onDelete('set null');
            });
            
            Schema::create('todo_user',function($table){
                
                $table->engine = 'InnoDB';
                
                $table->integer('todo_id')->unsigned();
                $table->integer('user_id')->unsigned();
                $table->timestamps();
                
                $table->foreign('todo_id')->references('id')->on('todos')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
            
//            Schema::table('todo_user',function($table){ 
//            });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
             Schema::drop('todo_user');
             Schema::drop('todos');
	}

}
