enable :sessions

get '/logged_in' do
  user = current_user()

  respond_to do |wants|
    wants.html { user.to_json } 
  end
end

post '/login' do
  p params
  username = params[:username]
  password = params[:password]

  # validate the user 
  user = User.authenticate(username, password)

  if user
    # create a new session instance
    @session = Session.new(:user => user, :ip_address => request.ip, :user_agent => request.user_agent, :expiry_time => 24.hours.from_now) 
    if @session.save
      # user is logged in
      session[:user_id] = user.id
      respond_to do |wants|
          redirect to('/')
      end
    else
      # unexpected error occured
      respond_to do |wants|
        wants.html { "Unexpected Error" }
      end
    end
  else
    res = { :response_code => 400, :response => 'bad login' }
    respond_to do |wants|
      wants.html { "Bad login" }
      wants.json { res.to_json }
    end
  end

end

get '/logout' do
  # log the current_user() out
  user = current_user()

  # delete all sessions associated with this user
  Session.where(:user_id => user.id).destroy_all

  redirect to('/login')
end
