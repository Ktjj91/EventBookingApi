import User from '#models/user'

export default class EventCreate {

  public create(user:User){
    return user.role === 'ADMIN'
  }
}
