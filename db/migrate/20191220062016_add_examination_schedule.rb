class AddExaminationSchedule < ActiveRecord::Migration[5.1]
  def change
  	create_table :examination_schedules, id: :integer do |t|
  		t.integer :user_id
  		t.integer :room_id
  		t.integer :hospital_id
  		t.integer :quota
  		t.string :dayname
  		t.time :time_start
  		t.time :time_end
  		t.time :close_register
  		t.timestamps null: false
  	end
  end
end
