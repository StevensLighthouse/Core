enable :sessions

# GET /login
# Provides a login page
get '/login' do 
  respond_to do |format|
    format.html { erb :'sessions/login' }
  end
end

post '/login' do
  username = params[:username]
  password = params[:password]

  # validate the user 
  user = User.authenticate(username, password)

  if user
    # create a new session instance
    @session = Session.new(:ip_address => request.ip, :user_agent => request.user_agent, :expiry_time => 24.hours.from_now) 
    if @session.save
      # user is logged in
      session[:user_id] = user.id
      respond_to do |wants|
        wants.html { "Log out" }
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
