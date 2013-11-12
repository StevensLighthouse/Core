FactoryGirl.define do
  factory :tour do
    name "Pizza Tour of Hoboken"
    description "A tour of the hottest pizza places in Hoboken"
    visibility true
    lat 30.888444
    lon 123.878787
  end

  factory :stop do
    name "Giovanni's Pizzeria"
    description "The closes pizzeria to Stevens!"
    lat 40.743321
    lon -74.030085     
  end

end
