# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131105202558) do

  create_table "stops", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "category_id"
    t.integer  "editor_id"
    t.integer  "creator_id"
    t.boolean  "visibility"
    t.decimal  "lat",         precision: 9, scale: 6
    t.decimal  "lon",         precision: 9, scale: 6
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tours", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "editor_id"
    t.integer  "creator_id"
    t.boolean  "visibility"
    t.decimal  "lat",         precision: 9, scale: 6
    t.decimal  "lon",         precision: 9, scale: 6
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email"
    t.string   "hashed_password"
    t.string   "password_salt"
    t.datetime "last_login"
    t.integer  "creator_id"
    t.integer  "editor_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
