get '/' do
  redirect to('/login') unless current_user()
  @current_user = current_user()
  if @current_user.is_editor?
    @stops = Stop.all
        
    respond_to do |format|
      format.html { erb :'home/index', :layout => :layout_new }
      format.json { { :tours => @tours }.to_json }
    end
  end
end

get '/create_tour' do
  # create a sample tour
  t = Tour.create(:name => "Test Tour", :description => "This is a test description", :visibility => true, :lat => 333.999999, :lon => 333.999999) 
  puts t
end
