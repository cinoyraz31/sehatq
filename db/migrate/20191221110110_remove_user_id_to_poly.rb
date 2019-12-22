class RemoveUserIdToPoly < ActiveRecord::Migration[5.1]
  def change
    remove_column :polies, :user_id
  end
end
