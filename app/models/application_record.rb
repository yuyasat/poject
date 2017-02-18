class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  scope :new_order, -> { order('id desc') }

  def self.latest
    order(:id).last
  end
end
