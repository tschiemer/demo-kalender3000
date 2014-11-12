<?php

class Todo extends Eloquent {
    
    protected $table = 'todos';
 
    public function assignees(){
        return $this->belongsToMany('User');
    }
    
}