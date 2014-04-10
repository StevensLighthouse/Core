# GET /groups
# Index of all all groups
get '/groups' do
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_site_admin?
    @groups = Group.all

    respond_to do |format|
      format.json { { :groups => @groups }.to_json }
    end
  elsif @current_user.is_group_admin? and @current_user.group_id
      @groups = Group.where(:id => @current_user.group_id)
      respond_to do |format|
        format.json { { :groups => @groups }.to_json }
    end
  end
end

# GET /groups/:id
# Show a group by specifing an ID
get '/groups/:id' do |id|
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_site_admin?
    @group = Group.find(id)

    { :group => @group }.to_json
  end
end

# POST /groups
# Create a new group
post '/groups' do
  redirect to('/login') unless current_user
  @current_user = current_user
  if @current_user.is_site_admin?
    @group = Group.create(group_params)
    if @group.save
      { :status => :created, :group => @group }.to_json
    else
      { :status => :unprocessable_entity, :errors => @group.errors }.to_json
    end
  end
end

# PUT /groups/:id
# Update a group, specify it by the ID and list the params you are updating
put '/groups/:id' do |id|
  redirect to('/login') unless current_user
  @current_user = current_user

  if @current_user.is_group_admin?
    @group = Group.find(id)
    
    # if you are only a group admin and trying to access a different group than your own, error out
    if not @current_user.is_site_admin? and @current_user.group_id and @group.id != @current_user.group_id
      respond_to do |format|
        format.json { { :status => :permission_denied, :errors => ["You do not have permission to update this group"] }.to_json }
      end
    end    
    
    # Attempt to update the group
    if @group.update(group_params)
      { :status => :updated, :group => @group}.to_json
    # The group was not correctly updated, show errors
    else
      { :errors => @group.errors, :status => :unprocessable_entity }.to_json
    end
  end
end


# DELETE /groups/:id
# Deletes a group and all associated data
delete '/groups/:id' do
  redirect to('/login') unless current_user
  @current_user = current_user

  if @current_user.is_group_admin?
    @group = Group.find(params[:id])

    if @group.destroy
      { :status => :deleted }.to_json
    else
      { :status => :unprocessable_entity }.to_json
    end
  end
end

def group_params
  params.allow(:name, :description)
end
