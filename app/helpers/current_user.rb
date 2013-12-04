private
def current_user
  @current_user ||= User.find(session[:user_id]) if session[:user_id] && Session.where("user_id = ? AND expiry_time > ?", session[:user_id], Time.now).present?
end
