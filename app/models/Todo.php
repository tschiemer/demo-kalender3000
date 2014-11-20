<?php

class Todo extends Eloquent {
    
    const PRIORITY_CRITICAL     = 'critical';
    const PRIORITY_HIGH         = 'high';
    const PRIORITY_NORMAL       = 'normal';
    const PRIORITY_LOW          = 'low';
    
    const STATE_PENDING         = 'pending';
    const STATE_CLOSED          = 'closed';
    
    protected $table = 'todos';
 
    public function assignees(){
        return $this->belongsToMany('User');
    }
    
    public function closedBy(){
        return $this->belongsTo('User','closedByUserId');
    }
    
    public function closeByUser(User $user){
        if ($this->state == self::STATE_PENDING){
            $this->state = self::STATE_CLOSED;
            $this->closedDate = date('y-m-d H:i:s',time());
            $this->closedByUserId = $user->id;
        }
    }
    
    public function reopen(){
        if ($this->state == self::STATE_CLOSED){
            $this->state = self::STATE_PENDING;
            $this->closedDate = NULL;
            $this->closedByUserId = NULL;
        }
    }
    
}