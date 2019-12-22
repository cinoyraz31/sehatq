class AddTablePolies < ActiveRecord::Migration[5.1]
  def change
    create_table :polies, id: :integer do |t|
  		t.integer :hospital_id
  		t.integer :user_id
  		t.string :title
  		t.text :description
  		t.timestamps null: false
  	end
  end
end
