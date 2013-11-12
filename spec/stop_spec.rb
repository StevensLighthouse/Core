require 'spec_helper'

describe 'Stops' do

  it 'rejects latitutes greater than 90.0' do
    stop = FactoryGirl.build(:stop, :lat => 100.092839)
    stop.should_not be_valid
  end

  it 'rejects latitudes less than -90.0' do
    stop = FactoryGirl.build(:stop, :lat => -100.000000)
    stop.should_not be_valid
  end

  it 'accepts latitudes greater than -90 and less than 90' do
    stop = FactoryGirl.build(:stop, :lat => 10.989898)
    stop.should be_valid
  end

  it 'rejects longitudes greater than 180.0' do
    stop = FactoryGirl.build(:stop, :lon => 200.092839)
    stop.should_not be_valid
  end

  it 'rejects longitudes less than -180.0' do
    stop = FactoryGirl.build(:stop, :lon => -200.000000)
    stop.should_not be_valid
  end

  it 'accepts longitudes greater than -180 and less than 180' do
    stop = FactoryGirl.build(:stop, :lat => 10.989898)
    stop.should be_valid
  end
end
