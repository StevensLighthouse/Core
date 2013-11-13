# GET /permissions
# Index of all permissions
get '/permissions' do
  @permissions = Permission.all

  { :permissions => @permissions }.to_json
end
