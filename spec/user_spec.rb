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

  it 'accepts user with password longer than 6 characters' do
    user = FactoryGirl.build(:user, :password => 'longpassword', :password_confirmation => 'longpassword')
    user.should be_valid
  end
  
  it 'is a site admin account' do
    user = FactoryGirl.build(:user, :permission => 4)
    user.is_site_admin?.should be(true)
  end

  it 'should not be a site admin account' do
    user = FactoryGirl.build(:user, :permission => 2)
    user.is_site_admin?.should be(false)
  end

  it 'is a group admin account' do
    user = FactoryGirl.build(:user, :permission => 3)
    user.is_group_admin?.should be(true)
  end

  it 'should not be a group admin account' do
    user = FactoryGirl.build(:user, :permission => 2)
    user.is_group_admin?.should be(false)
  end

  it 'is a builder account' do
    user = FactoryGirl.build(:user, :permission => 2)
    user.is_builder?.should be(true)
  end
  
  it 'should not be a builder account' do
    user = FactoryGirl.build(:user, :permission => 1)
    user.is_builder?.should be(false)
  end
  
  it 'should be a builder, group admin and site admin' do
    user = FactoryGirl.build(:user, :permission => 4)
    user.is_builder?.should be(true)
    user.is_group_admin?.should be(true)
    user.is_site_admin?.should be(true)
  end

  it 'is an editor account' do
    user = FactoryGirl.build(:user, :permission => 1)
    user.is_editor?.should be(true)
  end

  it 'should not be an editor account' do
    user = FactoryGirl.build(:user, :permission => 0)
    user.is_editor?.should be(false)
  end

  it 'is a deactivated account' do
    user = FactoryGirl.build(:user, :permission => 0)
    user.is_deactivated_account?.should be(true)
  end

  it 'should not be a deavtivated account' do
    user = FactoryGirl.build(:user, :permission => 4)
    user.is_deactivated_account?.should be(false)
  end



end
