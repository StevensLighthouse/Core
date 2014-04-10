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

# Create a group
g1 = Group.find_or_create_by(:name => 'Steven\'s', :description => 'School in Hoboken NJ')

# Create categories
c1 = Category.find_or_create_by(:name => 'Food', :description => 'Something you consume', :icon_base64 => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlFQkRCMzAzQjg3QTExRTM4OUVCQzhBMkZBMjM4NjcyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlFQkRCMzA0Qjg3QTExRTM4OUVCQzhBMkZBMjM4NjcyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUVCREIzMDFCODdBMTFFMzg5RUJDOEEyRkEyMzg2NzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUVCREIzMDJCODdBMTFFMzg5RUJDOEEyRkEyMzg2NzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7j+J3RAAALhUlEQVR42sxaCVSN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')
c2 = Category.find_or_create_by(:name => 'Art', :description => 'A place where artwork such as sculptures, paintings, or pictures can be found', :icon_base64 => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlFQkRCMzA3Qjg3QTExRTM4OUVCQzhBMkZBMjM4NjcyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlFQkRCMzA4Qjg3QTExRTM4OUVCQzhBMkZBMjM4NjcyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUVCREIzMDVCODdBMTFFMzg5RUJDOEEyRkEyMzg2NzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUVCREIzMDZCODdBMTFFMzg5RUJDOEEyRkEyMzg2NzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4MzHvUAAAN9UlEQVR42syZCVRV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')
c3 = Category.find_or_create_by(:name => 'Bar', :description => 'A place to consume alcohol', :icon_base64 => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxQThBNTNFQjg3QjExRTM4OUVCQzhBMkZBMjM4NjcyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkxQThBNTNGQjg3QjExRTM4OUVCQzhBMkZBMjM4NjcyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUVCREIzMDlCODdBMTFFMzg5RUJDOEEyRkEyMzg2NzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUVCREIzMEFCODdBMTFFMzg5RUJDOEEyRkEyMzg2NzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6cVGIbAAAI3UlEQVR42txaeUxU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')
c4 = Category.find_or_create_by(:name => 'Landmark', :description => 'An object or feature of the landscape that is easily seen or recognized from a distance', :icon_base64 => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxQThBNTQyQjg3QjExRTM4OUVCQzhBMkZBMjM4NjcyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkxQThBNTQzQjg3QjExRTM4OUVCQzhBMkZBMjM4NjcyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTFBOEE1NDBCODdCMTFFMzg5RUJDOEEyRkEyMzg2NzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTFBOEE1NDFCODdCMTFFMzg5RUJDOEEyRkEyMzg2NzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/MZmqAAAIn0lEQVR42tRaeUwU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')
