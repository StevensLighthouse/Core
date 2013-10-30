require 'spec_helper'

describe 'Tours' do

  it 'rejects latitutes greater than 90.0' do
    tour = FactoryGirl.build(:tour, :lat => 100.092839)
    tour.should_not be_valid
  end

end
