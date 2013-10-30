post '/create_tour' do
  t = Tour.create(listing_params)
end

private
def listing_params
  params.allow(:name, :description, :visibility, :lat, :lon)
end
