require 'spec_helper'

describe 'Users' do

  it 'rejects mismatching password confirmation' do
    user = FactoryGirl.build(:user, :password_confirmation => '')
    user.should_not be_valid
  end

  it 'accepts user with matching password and password confirmation' do
    user = FactoryGirl.build(:user)
    user.should be_valid
  end

  it 'rejects user with no password confirmation' do
    user = FactoryGirl.build(:user, :password_confirmation => '')
    user.should_not be_valid
  end

  it 'rejects user without email address' do
    user = FactoryGirl.build(:user, :email => '')
    user.should_not be_valid
  end

  it 'rejects user with invalid email address' do
    user = FactoryGirl.build(:user, :email => 'bademail')
    user.should_not be_valid

    user = FactoryGirl.build(:user, :email => 'a@b.c')
    user.should_not be_valid
  end

  it 'rejects user with password less than 6 characters' do
    user = FactoryGirl.build(:user, :password => 'a', :password_confirmation => 'a')
    user.should_not be_valid
  end

end
