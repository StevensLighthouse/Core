post '/create_stop' do
  t = Stop.create(listing_params)
end

private
def listing_params
  params.allow(:name, :category, :description, :visibility, :lat, :lon, :parentid)
end
