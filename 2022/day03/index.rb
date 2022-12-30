# frozen_string_literal: true

input = File.read("#{__dir__}/input.txt")

@rucksacks = input.split("\n")
@letters = [*('a'..'z'), *('A'..'Z')]

def get_prio(letter)
  @letters.find_index(letter) + 1
end

def task1
  @rucksacks.map do |rucksack|
    compartment1, compartment2 = rucksack.chars.each_slice(rucksack.size / 2).to_a
    get_prio(compartment1.intersection(compartment2).first)
  end.sum
end

def task2
  @rucksacks.each_slice(3).map do |rucksacks|
    rucksack1, rucksack2, rucksack3 = rucksacks.map(&:chars)
    get_prio(rucksack1.intersection(rucksack2, rucksack3).first)
  end.sum
end

puts task1
puts task2
