from mock_generator import MockGenerator
import json

gen = MockGenerator("mock/sample_input.json")
tilemap = gen.generate()
image = tilemap.as_image()
image.save('mock/images/tilemap_image.png')
collision_map = tilemap.as_collision_map()
with open('mock/tilemap_collision.json', 'w') as f:
    collision_json = json.dumps(collision_map)
    f.write(collision_json)