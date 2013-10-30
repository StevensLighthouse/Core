post '/create_tour' do 	
  p params
  Tour.create(params[:name],params[:description], params[:creator], params[:editor], params[:visibility], params[:lat], params[:lon])

end
