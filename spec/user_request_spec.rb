require 'spec_helper'

describe "User API" do

  it 'returns user specific information' do
    u = FactoryGirl.create(:user)

    get "/users/#{u.id}.json"
    expect(last_response).to be_ok

    json = JSON.parse(last_response.body)
    expect(json).to_not be_nil
  end

end

