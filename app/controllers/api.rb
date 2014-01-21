namespace '/api' do

  get '/tours' do
    pass unless request.accept? 'application/json'
    @tours = Tour.public_within(params[:lat], params[:lon], params[:distance])
    @stops = Stop.all

    respond_to do |wants|
      wants.json { { :tours => @tours }.to_json }
    end
  end

  # Show a tour
  get '/tours/:id' do |id|
    pass unless request.accept? 'application/json'
    @tour = Tour.find(id)

    # Maybe just @tour.to_json
    # Your choice
    { :tour => @tour }.to_json
  end

end
