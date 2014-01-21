require 'factory_girl'
require_relative '../spec/factories/factories'

# create a user account, override the email address if you like
#   default password: testpassword
#   ---
#   you can override the password as well using password
#   and password_confirmation
#   ---
FactoryGirl.create(:user, :email => 'ehayon@gmail.com', :permission => 4)

# Create some tours and stops
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

p1 = Permission.find_or_create_by(:name => 'Admin', :description => 'Grants the highest level of permissions to the user', :level => 1)
p2 = Permission.find_or_create_by(:name => 'Team Leader', :description => 'Grants the user the ability to add/remove users from the group', :level => 2)
p3 = Permission.find_or_create_by(:name => 'Builder', :description => 'Grants the user the power to creat/edit/delete stops and tours', :level => 3)
p4 = Permission.find_or_create_by(:name => 'Editor', :description => 'Grants the user the power to edit stops and tours', :level => 4)

u1 = User.find_or_create_by(:email => 'fake@email.com', :hashed_password => 'isnotreal', :password_salt => 'badpassword')
