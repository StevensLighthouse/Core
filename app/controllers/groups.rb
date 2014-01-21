# GET /groups
# Index of all all groups
get '/groups' do
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_site_admin?
    @groups = Group.all

    respond_to do |format|
      format.json { { :groups => @groups }.to_json }
    end
  end
end

# GET /groups/:id
# Show a group by specifing an ID
get '/groups/:id' do |id|
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_site_admin?
    @group = Group.find(id)

    { :group => @group }.to_json
  end
end

# POST /groups
# Create a new group
post '/groups' do
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_site_admin?
    @group = Groups.create(group_params)
    if @group.save
      { :status => :created, :group => @group }.to_json
    else
      { :status => :unprocessable_entity, :errors => @group.errors }.to_json
    end
  end
end

def group_params
  params.allow(:name, :description)
end
