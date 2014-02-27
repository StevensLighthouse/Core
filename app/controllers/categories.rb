# GET /categories
# Get a list of all the categories
get '/categories' do
  @categories = Category.all
  { :categories => @categories }.to_json
end
