
module {

  public type Ref<V> = {
    var v: V;
  };

  public func init<V>(value: V) : Ref<V> {
    { var v = value; };
  };

};