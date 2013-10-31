require 'spec_helper'

describe 'Tours' do

  it 'rejects latitutes greater than 90.0' do
    tour = FactoryGirl.build(:tour, :lat => 100.092839)
    tour.should_not be_valid
  end

  it 'rejects latitudes less than -90.0' do
    tour = FactoryGirl.build(:tour, :lat => -100.000000)
    tour.should_not be_valid
  end

  it 'accepts latitudes greater than -90 and less than 90' do
    tour = FactoryGirl.build(:tour, :lat => 10.989898)
    tour.should be_valid
  end

  it 'rejects longitudes greater than 180.0' do
    tour = FactoryGirl.build(:tour, :lon => 200.092839)
    tour.should_not be_valid
  end

  it 'rejects longitudes less than -180.0' do
    tour = FactoryGirl.build(:tour, :lon => -200.000000)
    tour.should_not be_valid
  end

  it 'accepts longitudes greater than -180 and less than 180' do
    tour = FactoryGirl.build(:tour, :lat => 10.989898)
    tour.should be_valid
  end
end
