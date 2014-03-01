get '/' do
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_editor?
    respond_to do |format|
      format.html { erb :'app/index' }
    end
  end
end

# GET /login
# Provides a login page
get '/login' do 
   erb :'app/login', :layout => :login
end
