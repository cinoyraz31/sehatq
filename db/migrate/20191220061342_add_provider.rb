class AddProvider < ActiveRecord::Migration[5.1]
  def change
  	create_table :providers, id: :integer do |t|
  		t.integer :user_id
  		t.string :provider_name
  		t.string :provider_email
  		t.string :data_json
  		t.timestamps null: false
  	end
  end
end
