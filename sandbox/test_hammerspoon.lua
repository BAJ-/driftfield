-- Test Hammerspoon HTTP communication

local TEST_URL = "http://localhost:8080"

function testHttp()
    local testData = {
        message = "Hello from Hammerspoon!",
        test = "communication"
    }
    
    print("Testing HTTP...")
    
    hs.http.asyncPost(TEST_URL, hs.json.encode(testData), {
        ["Content-Type"] = "application/json"
    }, function(status, body, headers)
        print("Status:", status)
        print("Response:", body)
        if status == 200 then 
            print("HTTP working")
        else
            print("HTTP failed")
        end
    end)
end

hs.hotkey.bind({"alt", "shift"}, "t", testHttp)

print("Hammerspoon HTTP test loaded. Press Alt+Shift+T to test.")
