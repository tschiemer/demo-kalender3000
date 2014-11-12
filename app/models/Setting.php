<?php

class Setting extends Eloquent {
    
    protected $table = 'settings';
    
//    static public function int($key){
//        $setting = Setting::findOrCreate(array('key'=>$key));
//        return intval($setting->value);
//    }
//    
//    static public function float($key){
//        $setting = Setting::findOrCreate(array('key'=>$key));
//        return floatval($setting->value);
//    }
//    
//    static public function string($key){
//        $setting = Setting::findOrCreate(array('key'=>$key));
//        return $setting->value;
//    }
//    
//    static public function object($key){
//        $setting = Setting::findOrCreate(array('key'=>$key));
//        return json_decode($setting->value);
//    }
    
    static public function get($key,$default=NULL){
        $setting = Setting::where('key',$key)->first();
        if (empty($setting)){
            $setting = new Setting();
            $setting->key = $key;
            $setting->value = json_encode($default);
            $setting->save();
            return $default;
        } else {
            return json_decode($setting->value);
        }
    }
    
    static public function set($key,$value){
        $setting = Setting::where('key',$key)->first();
        if (empty($setting)){
            $setting = new Setting();
            $setting->key = $key;
        }
        $setting->value = json_encode($value);
        $setting->save();
    }
    
}