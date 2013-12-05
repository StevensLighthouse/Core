t= Tour.find_or_create_by(:name => 'Pizza Tour',
               :description => 'A Tour that incorporates all of the best pizza stops in Hoboken, New Jersey.',
               :visibility => true, 
               :lat => 40.744331,
               :lon => -74.029003)

s1 = Stop.find_or_create_by(:name => 'Benny Tudino\'s Pizzeria', :description => 'The biggest pizza in town', :lat => 40.744331, :lon => -74.029003, :visibility => false)
s2 = Stop.find_or_create_by(:name => 'Giovanni\'s Pizzeria and Restaurant', :description => 'Great Pizza, Great Prices', :lat => 40.743599, :lon => -74.028865, :visibility => false)
s3 = Stop.find_or_create_by(:name => 'Up Town Pizzeria', :description => 'A ring of sauce, a ring of cheese, a ring of sauce…', :lat => 40.75332, :lon => -74.025366, :visibility => false)

t.stops << s1
t.stops << s2
t.stops << s3

t.save

