<?php

class Setting extends Eloquent {
    
    protected $table = 'settings';
    
    public function g($default=NULL){
        if ($type === NULL){
            return $default;
        } else {
            return $this->value;
        }
    }
    
    public function getValueAttribute($value){
        if ($value === NULL){
            return NULL;
        } else {
            return json_decode($value);
        }
    }
    
    public function setValueAttribute($value){
        $this->attributes['type'] = gettype($value);
        $this->attributes['value'] = json_encode($value);
    }
    
    static public function get($key,$default=NULL){
        $setting = Setting::where('key',$key)->first();
        if (empty($setting)){
            $setting = new Setting();
            $setting->key = $key;
            $setting->value = json_encode($default);
            $setting->save();
        }
        return $setting->g($default);
    }
    
    static public function set($key,$value,$internal=FALSE){
        $setting = Setting::where('key',$key)->first();
        if (empty($setting)){
            $setting = new Setting();
            $setting->key = $key;
            $setting->internal = (bool)$internal;
        }
        $setting->value = $value;
        $setting->save();
    }
    
}