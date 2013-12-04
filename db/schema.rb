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

ActiveRecord::Schema.define(version: 20131204001601) do

  create_table "categories", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.text     "icon_base64"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories_stops", force: true do |t|
    t.integer  "category_id"
    t.integer  "stop_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", force: true do |t|
    t.string   "user_agent"
    t.datetime "expiry_time"
    t.string   "ip_address"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  create_table "stops", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "editor_id"
    t.integer  "creator_id"
    t.boolean  "visibility"
    t.decimal  "lat",         precision: 9, scale: 6
    t.decimal  "lon",         precision: 9, scale: 6
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "deleted",                             default: false
  end

  create_table "stops_tours", id: false, force: true do |t|
    t.integer  "tour_id"
    t.integer  "stop_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "position"
  end

  add_index "stops_tours", ["stop_id", "tour_id", "position"], name: "index_stops_tours_on_stop_id_and_tour_id_and_position", unique: true

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
    t.boolean  "deleted",                             default: false
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
    t.integer  "permission"
  end

end
