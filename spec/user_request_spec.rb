require 'spec_helper'

describe "User API" do

  it 'returns user specific information' do
    u = FactoryGirl.create(:user)

    get "/users/#{u.id}.json"
    expect(last_response).to be_ok

    json = JSON.parse(last_response.body)
    expect(json).to_not be_nil
  end

  it 'logs a user in' do
    u = FactoryGirl.create(:user)

    post "/login", :username => u.email, :password => u.password

    last_response.body.should =~ /Log out/

    session = Session.where(:user_id => u.id).last
    session.should_not be(nil)

  end
end

