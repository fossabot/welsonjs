song = ["do", "re", "mi", "fa", "so"]

singers = {Jagger: "Rock", Elvis: "Roll"}

bitlist = [
  1, 0, 1
  0, 0, 1
  1, 1, 0
]

kids =
  brother:
    name: "Max"
    age:  11
  sister:
    name: "Ida"
    age:  9

main = (args) -> 
  console.log song.join(',')
  console.log JSON.stringify(singers)
  console.log bitlist.join(',')
  console.log JSON.stringify(kids)
  console.log "Hello world, CoffeeScript"

exports.main = main