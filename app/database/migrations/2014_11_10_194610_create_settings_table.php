<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
            Schema::create('settings',function($table){
                
                $table->engine = 'InnoDB';
                
                $table->increments('id');
                $table->string('key');
                $table->string('type')->nullable()->default(NULL);
                $table->boolean('internal')->default(FALSE);
                $table->text('value')->nullable()->default(NULL);
                $table->timestamps();
            });
            
            Setting::set('pageTitle', "Kalender");
//            Setting::set('n-per-page',4);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('settings');
	}

}
