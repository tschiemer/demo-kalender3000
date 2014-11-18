<?php

class Todo extends Eloquent {
    
    const PRIORITY_CRITICAL     = 'critical';
    const PRIORITY_HIGH         = 'high';
    const PRIORITY_NORMAL       = 'normal';
    const PRIORITY_LOW          = 'low';
    
    protected $table = 'todos';
 
    public function assignees(){
        return $this->belongsToMany('User');
    }
    
}